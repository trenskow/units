import merge from '@trenskow/merge';

const metricSuffixes = {
	minor: [{
		prefixes: ['y','yocto'],
		multiplier: Math.pow(10, -24)
	}, {
		prefixes: ['z','zepto'],
		multiplier: Math.pow(10, -21)
	}, {
		prefixes: ['a','atto'],
		multiplier: Math.pow(10, -18)
	}, {
		prefixes: ['f','femto'],
		multiplier: Math.pow(10, -15)
	}, {
		prefixes: ['p','pico'],
		multiplier: Math.pow(10, -12)
	}, {
		prefixes: ['n','nano'],
		multiplier: Math.pow(10, -9)
	}, {
		prefixes: ['μ','micro'],
		multiplier: Math.pow(10, -6)
	}, {
		prefixes: ['m','milli'],
		multiplier: Math.pow(10, -3)
	}, {
		prefixes: ['c','centi'],
		multiplier: Math.pow(10, -2)
	}, {
		prefixes: ['d','deci'],
		multiplier: Math.pow(10, -1)
	}],
	neutral: [{
		prefixes: [''],
		multiplier: 1
	}],
	major: [{
		prefixes: ['da','deca'],
		multiplier: Math.pow(10, 1)
	}, {
		prefixes: ['h','hecto'],
		multiplier: Math.pow(10, 2)
	}, {
		prefixes: ['k','kilo'],
		multiplier: Math.pow(10, 3)
	}, {
		prefixes: ['M','mega'],
		multiplier: Math.pow(10, 6)
	}, {
		prefixes: ['G','giga'],
		multiplier: Math.pow(10, 9)
	}, {
		prefixes: ['T','tera'],
		multiplier: Math.pow(10, 12)
	}, {
		prefixes: ['P','peta'],
		multiplier: Math.pow(10, 15)
	}, {
		prefixes: ['E','exa'],
		multiplier: Math.pow(10, 18)
	}, {
		prefixes: ['Z','zetta'],
		multiplier: Math.pow(10, 21)
	}, {
		prefixes: ['Y','yotta'],
		multiplier: Math.pow(10, 24)
	}]
};

let byteSuffixes = [{
	prefixes: ['Ki','kibi'],
	multiplier: Math.pow(1024, 1)
}, {
	prefixes: ['Mi','mibi'],
	multiplier: Math.pow(1024, 2)
}, {
	prefixes: ['Gi','gibi'],
	multiplier: Math.pow(1024, 3)
}, {
	prefixes: ['Ti','tebi'],
	multiplier: Math.pow(1024, 4)
}, {
	prefixes: ['Pi','pebi'],
	multiplier: Math.pow(1024, 5)
}, {
	prefixes: ['Ei','exbi'],
	multiplier: Math.pow(1024, 6)
}, {
	prefixes: ['Zi','zebi'],
	multiplier: Math.pow(1024, 7)
}, {
	prefixes: ['Yi','yobi'],
	multiplier: Math.pow(1024, 8)
}];

let durationSuffixes = [{
	fixes: ['m','minute','minutes'],
	multiplier: 60
}, {
	fixes: ['h','hour','hours'],
	multiplier: 60 * 60
}, {
	fixes: ['d','day','days'],
	multiplier: 60 * 60 * 24
}, {
	fixes: ['w','week','weeks'],
	multiplier: 60 * 60 * 24 * 7
}, {
	fixes: ['y','year','years'],
	multiplier: 60 * 60 * 24 * 365.24219
}];

const construct = (key, value) => {
	let obj = {};
	obj[key] = value;
	return obj;
};

byteSuffixes = merge(...metricSuffixes.neutral.concat(metricSuffixes.major, byteSuffixes)
	.map(({ prefixes, multiplier }) => {
		return ['B','byte','bytes'].map((suffix) => {
			return prefixes.map((prefix) => construct(`${prefix}${suffix}`, multiplier));
		});
	})
	.flat(Infinity));

const valueSearch = '-?[0-9]+(?:\\.[0-9]+)?(?:[eE](?:-|\\+)?[0-9]+)?';
const byteSuffixSearch = Object.keys(byteSuffixes).map((suffix) => `(?:${suffix})`).join('|');

const byte = {
	suffixes: byteSuffixes,
	destructor: new RegExp(`^(${valueSearch})(${byteSuffixSearch})$`,'i')
};

durationSuffixes = merge(...durationSuffixes
	.map(({ fixes, multiplier }) => {
		return fixes.map((fix) => construct(fix, multiplier));
	})
	.flat(Infinity)
	.concat(
		metricSuffixes.minor.concat(metricSuffixes.neutral)
			.map(({ prefixes, multiplier }) => {
				return ['s','second','seconds'].map((suffix) => {
					return prefixes.map((prefix) => construct(`${prefix}${suffix}`, multiplier));
				});
			}).flat(Infinity)));

const durationSuffixSearch = Object.keys(durationSuffixes).map((suffix) => `(?:${suffix})`).join('|');

const duration = {
	suffixes: durationSuffixes,
	destructor: new RegExp(`^(${valueSearch})(${durationSuffixSearch})$`, 'i'),
	splitter: new RegExp(`${Object.keys(durationSuffixes).map((suffix) => `(?<=${suffix})`).join('|')}`, 'i')
};

const getMultiplier = (suffixes, suffix) => {

	let candidates = Object.keys(suffixes).filter((candidate) => candidate.toLowerCase() === suffix.toLowerCase());

	if (candidates.length == 0) throw new SyntaxError(`Unknown suffix '${suffix}'.`);
	if (candidates.length == 1) return suffixes[candidates[0]];

	candidates = Object.keys(suffixes).filter((candidate) => candidate === suffix);

	if (candidates.length !== 0) throw new SyntaxError(`Cannot determine multiplier from suffix '${suffix}'.`);

	return suffixes[candidates[0]];

};

const convert = (type, input, destinationSuffix) => {

	if (typeof input === 'undefined') return;
	if (input == null) return null;

	if (typeof input === 'number') return input;
	if (typeof input !== 'string') throw SyntaxError('Cannot parse value of type ' + (typeof input));

	const destinationMultiplier = getMultiplier(type.suffixes, destinationSuffix);

	let parts = [input];

	if (type.splitter) {
		parts = input.split(type.splitter);

		for (let idx = 1 ; idx < parts.length ; idx++) {
			if (/^[a-z]+$/.test(parts[idx])) {
				parts[idx - 1] += parts[idx];
				parts.splice(idx, 1);
				idx--;
			}
		}
	}

	return parts
		.map((part) => {
			const destructed = type.destructor.exec(part);
			if (!destructed) throw new SyntaxError(`Unknown input '${part}'.`);
			const [ , amount, suffix ] = destructed;
			const multiplier = getMultiplier(type.suffixes, suffix);
			return parseFloat(amount) * multiplier;
		})
		.reduce((result, part) => result + part, 0) / destinationMultiplier;

};

const applyFunctions = (to, suffixes) => {

	const all = Object.keys(suffixes)
		.sort((suffix1, suffix2) => suffixes[suffix1] - suffixes[suffix2]);

	all.forEach((suffix) => {
		[suffix, suffix.toLowerCase()].forEach((transformed) => {
			to[transformed] = (input) => {
				return to(input, suffix);
			};
		});
	});

};

let convertDuration = (input, to = 's') => {
	return convert(duration, input, to);
};

let convertBytes = (input, to = 'B') => {
	return convert(byte, input, to);
};

applyFunctions(convertDuration, duration.suffixes);
applyFunctions(convertBytes, byte.suffixes);

let units = {
	duration: convertDuration,
	bytes: convertBytes
};

export default units;

export {
	convertDuration as duration,
	convertBytes as bytes
};
