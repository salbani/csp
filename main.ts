import { Stack, Dictionary } from 'typescript-collections';
// require('source-map-support').install();
import * as SourceMaps from 'source-map-support';
import { Variable } from './lib/Variable';
import { ValueRealm } from './lib/ValueRealm';
import { Constraint } from './lib/Constraint';
import { BTFC } from './lib/BTFC';
SourceMaps.install();

const btfc = new BTFC(
  [
    new Variable('a', ValueRealm.FromRange(1, 15)),
    new Variable('b', ValueRealm.FromRange(1, 9)),
    new Variable('c', ValueRealm.FromRange(1, 9)),
    new Variable('d', ValueRealm.FromRange(1, 15)),
    new Variable('e', ValueRealm.FromRange(1, 15)),
    new Variable('f', ValueRealm.FromRange(1, 11)),
    new Variable('g', ValueRealm.FromRange(1, 15)),
    new Variable('h', ValueRealm.FromRange(1, 15)),
    new Variable('i', ValueRealm.FromRange(1, 9)),
  ],
  [
    'a + 4 <= c',
    'a + 4 <= b',
    'd + 3 <= e',
    'e + 4 <= f',
    'g + 3 <= h',
    'h + 4 <= i',
    'b + 4 <= c || b >= c + 4',
    'a + 4 <= e || a >= e + 4',
    'b + 4 <= d || b >= d + 3',
    'b + 4 <= g || b >= g + 3',
    'd + 3 <= g || d >= g + 3',
    'c + 4 <= i || c >= i + 4',
    'f + 2 <= h || f >= h + 4',
   ]
)

btfc.SolveAfterDegreeHeuristics();
