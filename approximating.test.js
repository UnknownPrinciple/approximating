import { test } from "node:test";
import { equal } from "node:assert/strict";
import { distance } from "./approximating.js";

test("sunday/saturday", () => {
	let p = "sunday";
	let t = "saturday";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("gttc/ttgccc", () => {
	let p = "gttc";
	let t = "ttgccc";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("short approximate matching", () => {
	let p = "strfy";
	let t = "long string to find";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("trailing/leading matching", () => {
	let p = "lostnd";
	let t = "long string to find";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("complex alignment", () => {
	let p = "acgtacgtacgt";
	let t = "acatacttgtact";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("numeric matching", () => {
	let p = "12345678";
	let t = "123478901";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

test("xmmjyauz/mmzjawxu", () => {
	let p = "xmmjyauz";
	let t = "mmzjawxu";
	equal(distance(p, t), distance(t, p), "Distance function should be symmetric");
	equal(distance(p, t), distanceWagnerFischer(p, t));
});

/**
 * Wagner-Fischer algorithm for Levenshtein distance metric.
 * Easier to implement than Myers bit-parallel, so can be useful for testing.
 *
 * @param {string} source
 * @param {string} target
 * @param {number} [ins=1]
 * @param {number} [del=1]
 * @param {number} [rep=1]
 */
function distanceWagnerFischer(source, target, ins = 1, del = 1, rep = 1) {
	// for all i and j, d[i,j] will hold the distance between the first i characters of s
	// and the first j characters of t note that d has (m+1)*(n+1) values
	let m = source.length + 1;
	let n = target.length + 1;
	let d = Array.from({ length: m }, () => new Uint32Array(n));

	// source prefixes can be transformed into empty string by dropping all characters
	for (let i = 1; i < m; i++) d[i][0] = i;
	// target prefixes can be reached from empty source prefix by inserting every character
	for (let j = 1; j < n; j++) d[0][j] = j;

	for (let j = 1; j < n; j++) {
		let t = target.charCodeAt(j - 1);
		for (let i = 1; i < m; i++) {
			let s = source.charCodeAt(i - 1);
			d[i][j] = Math.min(
				// deletion
				d[i - 1][j] + del,
				// insertion
				d[i][j - 1] + ins,
				// substitution
				d[i - 1][j - 1] + (s === t ? 0 : rep),
			);
		}
	}

	return d[m - 1][n - 1];
}
