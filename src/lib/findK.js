export default function findK (ktr, length, j) {
	let lo = 1;
	let hi = length;

	while (lo < hi) {
		const mid = ((lo + hi) / 2) >>> 0;

		if (j < ktr[mid]) {
			hi = mid;
		} else {
			lo = mid + 1;
		}
	}

	return lo;
}
