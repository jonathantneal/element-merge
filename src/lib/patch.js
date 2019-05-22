import append from './append';
import indexOf from './indexOf';
import isReversed from './isReversed';
import next from './next';
import patchNodes from './patchNodes';
import remove from './remove';
import smartDiff from './smartDiff';

export default function patch (
	targetNode, // where changes happen
	futureNode  // Array of future items/nodes
) {
	const currentNodes = Array.from(targetNode.childNodes);
	const futureNodes = Array.from(futureNode.childNodes);
	const currentLength = currentNodes.length;

	let currentEnd = currentLength;
	let currentStart = 0;
	let futureEnd = futureNodes.length;
	let futureStart = 0;

	// common prefix
	while (
		currentStart < currentEnd &&
		futureStart < futureEnd &&
		patchNodes(currentNodes[currentStart], futureNodes[futureStart])
	) {
		++currentStart;
		++futureStart;
	}

	// common suffix
	while (
		currentStart < currentEnd &&
		futureStart < futureEnd &&
		patchNodes(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
	) {
		--currentEnd;
		--futureEnd;
	}

	const currentSame = currentStart === currentEnd;
	const futureSame = futureStart === futureEnd;

	// same list
	if (currentSame && futureSame) {
		return futureNodes;
	}

	// only stuff to add
	if (currentSame && futureStart < futureEnd) {
		append(
			targetNode,
			futureNodes,
			futureStart,
			futureEnd,
			next(currentNodes, currentStart, currentLength, null)
		);

		return futureNodes;
	}

	// only stuff to remove
	if (futureSame && currentStart < currentEnd) {
		remove(
			targetNode,
			currentNodes,
			currentStart,
			currentEnd
		);

		return futureNodes;
	}

	const currentChanges = currentEnd - currentStart;
	const futureChanges = futureEnd - futureStart;
	let i = -1;

	// 2 simple indels: the shortest sequence is a subsequence of the longest
	if (currentChanges < futureChanges) {
		i = indexOf(
			futureNodes,
			futureStart,
			futureEnd,
			currentNodes,
			currentStart,
			currentEnd
		);

		// inner diff
		if (-1 < i) {
			append(
				targetNode,
				futureNodes,
				futureStart,
				i,
				currentNodes[currentStart]
			);

			append(
				targetNode,
				futureNodes,
				i + currentChanges,
				futureEnd,
				next(currentNodes, currentEnd, currentLength, null)
			);

			return futureNodes;
		}
	}
	/* istanbul ignore else */
	else if (futureChanges < currentChanges) {
		i = indexOf(
			currentNodes,
			currentStart,
			currentEnd,
			futureNodes,
			futureStart,
			futureEnd
		);

		// outer diff
		if (-1 < i) {
			remove(
				targetNode,
				currentNodes,
				currentStart,
				i
			);

			remove(
				targetNode,
				currentNodes,
				i + futureChanges,
				currentEnd
			);

			return futureNodes;
		}
	}

	// common case with one replacement for many nodes
	// or many nodes replaced for a single one
	/* istanbul ignore else */
	if ((currentChanges < 2 || futureChanges < 2)) {
		append(
			targetNode,
			futureNodes,
			futureStart,
			futureEnd,
			currentNodes[currentStart]
		);

		remove(
			targetNode,
			currentNodes,
			currentStart,
			currentEnd
		);

		return futureNodes;
	}

	// the half match diff part has been skipped in petit-dom
	// https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
	// accordingly, I think it's safe to skip in here too
	// if one day it'll come out like the speediest thing ever to do
	// then I might add it in here too

	// Extra: before going too fancy, what about reversed lists ?
	//        This should bail out pretty quickly if that's not the case.
	if (
		currentChanges === futureChanges &&
		isReversed(
			futureNodes,
			futureEnd,
			currentNodes,
			currentStart,
			currentEnd
		)
	) {
		append(
			targetNode,
			futureNodes,
			futureStart,
			futureEnd,
			next(currentNodes, currentEnd, currentLength, null)
		);

		return futureNodes;
	}

	// last resort through a smart diff
	smartDiff(
		targetNode,
		futureNodes,
		futureStart,
		futureEnd,
		futureChanges,
		currentNodes,
		currentStart,
		currentEnd,
		currentChanges,
		currentLength
	);

	return futureNodes;
}
