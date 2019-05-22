import patchNodes from './patchNodes';

export default function isReversed (
	futureNodes,
	futureEnd,
	currentNodes,
	currentStart,
	currentEnd
) {
	while (
		currentStart < currentEnd &&
		patchNodes(
			currentNodes[currentStart],
			futureNodes[futureEnd - 1]
		)
	) {
		++currentStart;
		--futureEnd;
	}

	return futureEnd === 0;
}
