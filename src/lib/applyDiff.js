import { DELETION, INSERTION, SKIP } from './constants';
import append from './append';
import remove from './remove';

export default function applyDiff (
	diff,
	parentNode,
	futureNodes,
	futureStart,
	currentNodes,
	currentStart,
	currentLength,
	before
) {
	const live = new WeakMap;
	const length = diff.length;
	let currentIndex = currentStart;
	let i = 0;

	while (i < length) {
		switch (diff[i++]) {
			case SKIP:
				++futureStart;
				++currentIndex;

				break;

			case INSERTION:
				// TODO: bulk appends for sequential nodes
				live.set(futureNodes[futureStart], 1);

				append(
					parentNode,
					futureNodes,
					++futureStart,
					futureStart,
					currentIndex < currentLength ?
						currentNodes[currentIndex] :
						before
				);

				break;
			case DELETION:
				++currentIndex;

				break;
		}
	}

	i = 0;

	while (i < length) {
		switch (diff[i++]) {
			case SKIP:
				++currentStart;

				break;
			case DELETION:
				// TODO: bulk removes for sequential nodes
				if (live.has(currentNodes[currentStart])) {
					++currentStart;
				} else {
					remove(
						parentNode,
						currentNodes,
						currentStart,
						++currentStart
					);
				}

				break;
		}
	}
}
