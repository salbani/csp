import { Constraint } from "./Constraint";
import { ValueRealm } from "./ValueRealm";
import { Dictionary, Stack } from "typescript-collections";

export class Variable {

  Constraints: Constraint[] = [];
  ValueHistory = new Stack<number>();

  private activeValueIndex = - 1
  get Value() {
    if (this.activeValueIndex < 0)
      return undefined;
    return this.ValueRealm.ValueOf(this.activeValueIndex)
  }

  get IsConsistent() {
    for (const constraint of this.Constraints) {
      const consistentRealm = constraint.ConsistentRealmOf(this);
      if(!consistentRealm.Contains(this.Value)) {
        console.log(`Variable ${this.Name} is inconsistent in ${constraint.Expression}`);
        return false;
      }
    }
    return true;
  }

  get ConsistentRealm() {
    const consistentRealm = this.ValueRealm.Clone();
    for (const constraint of this.Constraints) {
      consistentRealm.IntersectWith(constraint.ConsistentRealmOf(this));
    }
    return consistentRealm;
  }

  get HeurDegree() {
    return this.Constraints.filter((val) => !val.IsLocked).length;
  }

  get LexiDegree() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars.length - chars.indexOf(this.Name)
  }

  constructor(public Name: string, public ValueRealm: ValueRealm) {}

  private SetValue(value: number) {
    const index = this.ValueRealm.IndexOf(value)
    this.activeValueIndex = index;
    this.ValueHistory.add(this.Value);
  }

  nextValue() {
    for (const value of this.ValueRealm.Values) {
      if(!this.ValueHistory.contains(value)) {
        return this.SetValue(value);
      }
    }
  }

  hasNextValue() {
    for (const value of this.ValueRealm.Values) {
      if(!this.ValueHistory.contains(value)) {
        return true;
      }
    }
    return false;
  }

  unsetValue() {
    this.activeValueIndex = -1;
  }

  resetHistory() {
    this.ValueHistory.clear();
  }

  static DictOfVariables(...variables: Variable[]) {
    const dict = new Dictionary<string, Variable>();
    for (const variable of variables) {
      dict.setValue(variable.Name, variable);
    }
    return dict;
  }
}
