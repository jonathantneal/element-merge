import { DELETION, INSERTION, SKIP } from './constants';
import patchNodes from './patchNodes';

export default function ond (
	futureNodes,
	futureStart,
	rows,
	currentNodes,
	currentStart,
	cols
) {
	const length = rows + cols;
	const v = [];

	let d, k, r, c, pv, cv, pd;

	outer: for (d = 0; d <= length; ++d) {
		/* istanbul ignore if */
		if (d > SKIP_OND) {
			return null;
		}

		pd = d - 1;

		/* istanbul ignore next */
		pv = d ? v[d - 1] : [0, 0];
		cv = v[d] = [];

		for (k = -d; k <= d; k += 2) {
			if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
				c = pv[pd + k + 1];
			} else {
				c = pv[pd + k - 1] + 1;
			}

			r = c - k;

			while (
				c < cols &&
				r < rows &&
				patchNodes(
					currentNodes[currentStart + c],
					futureNodes[futureStart + r]
				)
			) {
				++c;
				++r;
			}

			if (c === cols && r === rows) {
				break outer;
			}

			cv[d + k] = c;
		}
	}

	const diff = Array(d / 2 + length / 2);

	let diffIdx = diff.length - 1;

	for (d = v.length - 1; d >= 0; --d) {
		while (
			c > 0 &&
			r > 0 &&
			patchNodes(
				currentNodes[currentStart + c - 1],
				futureNodes[futureStart + r - 1]
			)
		) {
			// diagonal edge = equality
			diff[diffIdx--] = SKIP;

			--c;
			--r;
		}

		if (!d) {
			break;
		}

		pd = d - 1;

		/* istanbul ignore next */
		pv = d ? v[d - 1] : [0, 0];
		k = c - r;

		if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
			// vertical edge = insertion
			--r;

			diff[diffIdx--] = INSERTION;
		} else {
			// horizontal edge = deletion
			--c;

			diff[diffIdx--] = DELETION;
		}
	}

	return diff;
}

const SKIP_OND = 50;
