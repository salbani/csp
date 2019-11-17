export class ValueRealm {

    private __values: number[] = [];

    get Length() {
        return this.__values.length;
    }

    static FromRange(from: number, to: number) {
        const realm = new ValueRealm();
        for (let i = 0; i <= to - from; i++) {
            realm.__values[i] = from + i;
        }
        return realm;
    }

    static FromValues(values: number[]) {
        const realm = new ValueRealm();
        for (const value of values) {
            realm.Push(value);
        }
        return realm;
    }

    ValueOf(index) {
        return this.__values[index];
    }

    get Values() {
        return [...this.__values];
    }

    IntersectWith(valueRealm: ValueRealm) {
        const newRealm: number[] = [];
        for (let i = 0; i < this.Length; i++) {
            if (!valueRealm.Contains(this.__values[i])) {
                this.Splice(i);
                i--;
            }
        }
        return this;
    }

    Clone() {
        const newRealm = new ValueRealm();
        for (const value of this.__values) {
            newRealm.__values.push(value);
        }
        return newRealm;
    }

    Contains(value: number) {
        return this.__values.indexOf(value) >= 0;
    }

    IndexOf(value: number) {
        return this.__values.indexOf(value);
    }

    Splice(start: number, deleteCount = 1) {
        return this.__values.splice(start, deleteCount);
    }

    Push(...values: number[]) {
        return this.__values.push(...values)
    }

    Pop() {
        return this.__values.pop()
    }

    Unshift(...values: number[]) {
        return this.__values.unshift(...values)
    }

    Shift() {
        return this.__values.shift()
    }
}
