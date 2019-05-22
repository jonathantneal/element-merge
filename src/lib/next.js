export default function next (list, i, length, before) {
	return i < length ?
		list[i]
	: (
		0 < i
			? list[i - 1].nextSibling
		: before
	);
}
