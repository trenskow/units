import { expect } from 'chai';

import { bytes, duration } from '../index.js';

describe('bytes', () => {
	it('should come back with mibibytes as kibibytes', () => {
		expect(bytes.kibibytes('1mibibyte')).to.equal(1024);
	});
	it ('should come back with kilobytes as bytes', () => {
		expect(bytes('2kb')).to.equal(2000);
	});
	it ('should pass through undefined', () => {
		expect(bytes()).to.equal();
	});
	it ('should pass through null', () => {
		expect(bytes(null)).to.equal(null);
	});
	it ('should pass through number', () => {
		expect(bytes(200)).to.equal(200);
	});
	it ('should throw error on unknown input', () => {
		expect(() => {
			bytes(new Date());
		}).to.throw(SyntaxError);
	});
	it ('should throw on undetermined destination unit', () => {
		expect(() => {
			bytes('0kb', 'asd');
		}).to.throw(SyntaxError);
	});
});

describe('durations', () => {
	it('should come back with days as hours', () => {
		expect(duration.hours('2days')).to.equal(48);
	});
	it ('should come back with minutes as milliseconds', () => {
		expect(duration.milliseconds('2m')).to.equal(120000);
	});
	it ('should come back with hours as seconds', () => {
		expect(duration('2h')).to.equal(7200);
	});
	it ('should pass through undefined', () => {
		expect(duration()).to.equal();
	});
	it ('should pass through null', () => {
		expect(duration(null)).to.equal(null);
	});
	it ('should pass through number', () => {
		expect(duration(200)).to.equal(200);
	});
	it ('should throw error on unknown input', () => {
		expect(() => {
			duration(new Date());
		}).to.throw(SyntaxError);
	});
	it ('should throw on undetermined destination unit', () => {
		expect(() => {
			duration('0kb', 'asd');
		}).to.throw(SyntaxError);
	});
	it ('should support multiple inputs', () => {
		expect(duration('2h22m', 'm')).to.equal(142);
	});
});
