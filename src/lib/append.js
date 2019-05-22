export default function append (parent, children, start, end, before) {
	if ((end - start) < 2) {
		parent.insertBefore(children[start], before);
	} else {
		const fragment = parent.ownerDocument.createDocumentFragment();

		while (start < end) {
			fragment.appendChild(children[start++]);
		}

		parent.insertBefore(fragment, before);
	}
}
