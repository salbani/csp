import { NamedValue } from "./INamedValue";
import { Variable } from "./Variable";
import { Dictionary } from "typescript-collections";
import { ValueRealm } from "./ValueRealm";

export class Constraint {

  get IsLocked() {
    for (const variable of this.ConnectedVariables) {
      if (variable.Value != null)
        return true;
    }
    return false;
  }

  get ConnectedVariables(): Variable[] {
    const variables: Variable[] = []
    for (const variable of this.Variables.values()) {
      if (this.Expression.indexOf(variable.Name) >= 0)
        variables.push(variable);
    }
    return variables;
  }

  get Expression() {
    return this.__Expression;
  }

  constructor(
    private __Expression: string,
    private Variables: Dictionary<string, Variable>,
  ) {
    for (const variable of this.ConnectedVariables) {
      variable.Constraints.push(this);
    }
  }

  ConsistentRealmOf(variable: Variable, ...values: NamedValue[]): ValueRealm {
    for (const connectedVariable of this.ConnectedVariables) {
      const consisitentRealm = variable.ValueRealm.Clone();
      if (values.filter(val => val.name == connectedVariable.Name).length == 0 && variable != connectedVariable) {
        if (connectedVariable.Value != null)
          consisitentRealm.IntersectWith(
            this.ConsistentRealmOf(variable, { name: connectedVariable.Name, value: connectedVariable.Value }, ...values)
          );
        else
          for (const value of connectedVariable.ValueRealm.Values) {
            consisitentRealm.IntersectWith(
              this.ConsistentRealmOf(variable, { name: connectedVariable.Name, value: value }, ...values)
            );
          }
        return consisitentRealm;
      }
    }
    const consisitentRealm = new ValueRealm();
    if (variable.Value == null)
      for (const value of variable.ValueRealm.Values) {
        if (this.evaluate({ name: variable.Name, value: value }, ...values))
          consisitentRealm.Push(value);
      }
    else if (this.evaluate({ name: variable.Name, value: variable.Value }, ...values))
      consisitentRealm.Push(variable.Value);
    return consisitentRealm;
  }

  evaluate(...values: NamedValue[]) {
    // console.log(values)
    let expression = this.Expression;
    for (const value of values) {
      if (expression.indexOf(value.name) >= 0) {
        const regEx = new RegExp(value.name, 'g');
        expression = expression.replace(regEx, value.value.toString())
        // console.log(`replaced ${value.name} in ${this.Expression} with ${value.value.toString()}: ${expression}`)
      }
    }
    for (const variable of this.Variables.values()) {
      if (expression.indexOf(variable.Name) >= 0) {
        if (variable.Value == null) {
          const regEx = new RegExp(variable.Name, 'g');
          expression = expression.replace(regEx, (variable.Value || 0).toString())
        }
        // console.log(`The variable ${variable.Name} has no value set but was expected in ${this.Expression}`)
      }
    }
    const result = eval(expression);
    if (typeof result != 'boolean') {
      console.log(`The evaluation result of ${expression} from ${this.Expression} was ${result} instead of a boolean`)
      return false;
    }
    return result;
  }
}
