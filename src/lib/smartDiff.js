import applyDiff from './applyDiff';
import hs from './hs';
import ond from './ond';

export default function smartDiff (
	parentNode,
	futureNodes,
	futureStart,
	futureEnd,
	futureChanges,
	currentNodes,
	currentStart,
	currentEnd,
	currentChanges,
	currentLength,
	before
) {
	applyDiff(
		ond(
			futureNodes,
			futureStart,
			futureChanges,
			currentNodes,
			currentStart,
			currentChanges
		) ||
		hs(
			futureNodes,
			futureStart,
			futureEnd,
			futureChanges,
			currentNodes,
			currentStart,
			currentEnd,
			currentChanges
		),
		parentNode,
		futureNodes,
		futureStart,
		currentNodes,
		currentStart,
		currentLength,
		before
	);
}
