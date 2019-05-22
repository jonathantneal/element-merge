import { DELETION, INSERTION, SKIP } from './constants';
import findK from './findK';

export default function hs (
	futureNodes,
	futureStart,
	futureEnd,
	futureChanges,
	currentNodes,
	currentStart,
	currentEnd,
	currentChanges
) {

	let k = 0;
	/* istanbul ignore next */
	let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
	const link = Array(minLen);
	const tresh = Array(++minLen);
	tresh[0] = -1;

	for (let i = 1; i < minLen; ++i)
		tresh[i] = currentEnd;

	const keymap = new WeakMap;
	for (let i = currentStart; i < currentEnd; ++i)
		keymap.set(currentNodes[i], i);

	for (let i = futureStart; i < futureEnd; ++i) {
		const idxInOld = keymap.get(futureNodes[i]);
		if (idxInOld != null) {
			k = findK(tresh, minLen, idxInOld);
			/* istanbul ignore else */
			if (-1 < k) {
				tresh[k] = idxInOld;
				link[k] = {
					newi: i,
					oldi: idxInOld,
					prev: link[k - 1]
				};
			}
		}
	}

	k = --minLen;
	--currentEnd;
	while (tresh[k] > currentEnd) --k;

	minLen = currentChanges + futureChanges - k;
	const diff = Array(minLen);
	let ptr = link[k];
	--futureEnd;
	while (ptr) {
		const {newi, oldi} = ptr;
		while (futureEnd > newi) {
			diff[--minLen] = INSERTION;
			--futureEnd;
		}
		while (currentEnd > oldi) {
			diff[--minLen] = DELETION;
			--currentEnd;
		}
		diff[--minLen] = SKIP;
		--futureEnd;
		--currentEnd;
		ptr = ptr.prev;
	}
	while (futureEnd >= futureStart) {
		diff[--minLen] = INSERTION;
		--futureEnd;
	}
	while (currentEnd >= currentStart) {
		diff[--minLen] = DELETION;
		--currentEnd;
	}
	return diff;
}
