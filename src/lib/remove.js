export default function remove (parent, children, start, end) {
	if ((end - start) < 2) {
		parent.removeChild(children[start], -1);
	} else {
		const range = parent.ownerDocument.createRange();

		range.setStartBefore(children[start], -1);
		range.setEndAfter(children[end - 1], -1);
		range.deleteContents();
	}
}
