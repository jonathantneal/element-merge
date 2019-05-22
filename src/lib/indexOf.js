import patchNodes from './patchNodes';

export default function indexOf (
	moreNodes,
	moreStart,
	moreEnd,
	lessNodes,
	lessStart,
	lessEnd
) {
	const length = lessEnd - lessStart;

	/* istanbul ignore if */
	if (length < 1) {
		return -1;
	}

	while ((moreEnd - moreStart) >= length) {
		let m = moreStart;
		let l = lessStart;

		while (
			m < moreEnd &&
			l < lessEnd &&
			patchNodes(moreNodes[m], lessNodes[l])
		) {
			++m;
			++l;
		}

		if (l === lessEnd) {
			return moreStart;
		}

		moreStart = m + 1;
	}

	return -1;
}
