'use strict';

const
	{ expect } = require('chai');

const
	{ bytes, duration } = require('../');

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
});
