import { Dictionary, Stack } from "typescript-collections";
import { Variable } from "./Variable";
import { Constraint } from "./Constraint";

export class BTFC {

  Variables: Dictionary<string, Variable>;
  VariablesHistory: Stack<Variable> = new Stack();

  constructor(variables: Variable[], constraints: string[]) {
    this.Variables = Variable.DictOfVariables(...variables);
    for (const constraint of constraints) {
      new Constraint(constraint, this.Variables);
    }
  }

  SolveAfterDegreeHeuristics() {
    let variable: Variable;
    for (const v of this.Variables.values()) {
      // console.log(v.Name, v.HeurDegree, v.Constraints.length, v.Value || -1);
      if (
        v.Value == null &&
        (
          variable == null ||
          v.HeurDegree > variable.HeurDegree ||
          (v.HeurDegree == variable.HeurDegree && v.LexiDegree > variable.LexiDegree)
        )
      )
        variable = v;
    }
    if (variable == null) {
      const result: { [key: string]: number } = {}
      for (const v of this.Variables.values()) {
        console.log(`Variable ${v.Name} with value ${v.Value} is consistent: ${v.IsConsistent}`)
        result[v.Name] = v.Value;
      }
      console.log('Result: ' + JSON.stringify(result));
      this.VariablesHistory.forEach(val => console.log(val.Name))
      return;
    }

    this.VariablesHistory.add(variable);
    variable.nextValue();
    // console.log(`Variable ${variable.Name} is set to ${variable.Value}`);

    for (const constraint of variable.Constraints) {
      for (const v of constraint.ConnectedVariables) {
        if (v == variable)
          continue;
        const consistentRealm = constraint.ConsistentRealmOf(v);
        // console.log(`Consistent realm of ${v.Name} in constraint ${constraint.Expression}: ${consistentRealm.Values}`)
        if (consistentRealm.Length == 0) {
          this.BackTracking();
          this.SolveAfterDegreeHeuristics();
          return;
        }
      }
    }
    // console.log(`Consistent value ${variable.Value} of variable ${variable.Name}`);
    this.SolveAfterDegreeHeuristics();
  }

  BackTracking() {
    if (this.VariablesHistory.isEmpty())
      throw Error('The CSP is not solvable! No more Backtracking available.')
    const lastVariable = this.VariablesHistory.pop();
    lastVariable.unsetValue();
    if (lastVariable.hasNextValue()) {
      // console.log(`Backtracking to next value of ${lastVariable.Name}`)
    } else {
      // console.log(`Backtracking to variable before ${lastVariable.Name}`)
      lastVariable.resetHistory();
      this.BackTracking();
    }
  }
}