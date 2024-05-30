// IDEA if I can find how to drop substitution from myers algorithm, I get matching() for free

let peq = new Uint32Array(0x10000);

/**
 * @param {string} pattern
 * @param {string} text
 */
export function distance(pattern, text) {
	// word is 32b, no blocks yet
	let ord = pattern.length < text.length;
	let a = ord ? text : pattern;
	let b = ord ? pattern : text;
	let n = a.length;
	let m = b.length;
	for (let i = n; i >= 0; i--) peq[a.charCodeAt(i)] |= 1 << i;
	let Score, Last, Eq, Xv, Xh, Pv, Ph, Mv, Mh;
	Score = n;
	Mv = 0;
	Pv = -1;
	Last = 1 << (n - 1);
	for (let i = 0; i < m; i++) {
		Eq = peq[b.charCodeAt(i)];
		Xv = Eq | Mv;
		Xh = (((Eq & Pv) + Pv) ^ Pv) | Eq;
		Ph = Mv | ~(Xh | Pv);
		Mh = Pv & Xh;
		if (Ph & Last) Score++;
		if (Mh & Last) Score--;
		Ph = (Ph << 1) | 1;
		Mh = Mh << 1;
		Pv = Mh | ~(Xv | Ph);
		Mv = Ph & Xv;
	}
	for (let i = n; i >= 0; i--) peq[a.charCodeAt(i)] = 0;
	return Score;
}

/**
 * @param {string} pattern
 * @param {string} text
 */
export function proximity(pattern, text) {
	return distance(pattern, text) / Math.max(pattern.length, text.length);
}

/**
 * @param {string} pattern
 * @param {string} text
 */
export function alignment(pattern, text) {
	// TODO implement me...
}
