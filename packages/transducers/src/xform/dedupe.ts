import { Predicate2, SEMAPHORE } from "@thi.ng/api";
import { Reducer, Transducer } from "../api";
import { compR } from "../func/compr";
import { $iter } from "../iterator";

export function dedupe<T>(equiv?: Predicate2<T>): Transducer<T, T>;
export function dedupe<T>(src: Iterable<T>): IterableIterator<T>;
export function dedupe<T>(equiv: Predicate2<T>, src: Iterable<T>): IterableIterator<T>;
export function dedupe<T>(...args: any[]): any {
    return $iter(dedupe, args) ||
        ((rfn: Reducer<any, T>) => {
            const r = rfn[2];
            const equiv = args[0];
            let prev: any = SEMAPHORE;
            return compR(rfn,
                equiv ?
                    (acc, x: T) => {
                        acc = equiv(prev, x) ? acc : r(acc, x);
                        prev = x;
                        return acc;
                    } :
                    (acc, x: T) => {
                        acc = prev === x ? acc : r(acc, x);
                        prev = x;
                        return acc;
                    });
        });
}
