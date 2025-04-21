import qualityModel from "./quality-model.js";

const polyval = (coefficients, x) => {
	let res = 0;
	for (const [index, el] of coefficients.entries()) {
		res += el * (x ** index);
	}

	return res;
};

const evaluateMetric = (metric, value) => {
	const out = {};
	out.avgValue = Number.parseFloat(value);
	const info = qualityModel[metric];
	out.avgScore = Number.parseFloat((polyval([...info.fitting.coefficients].reverse(), value) / info.fitting.max).toFixed(2));
	if (info.range && (value < info.range[0] || value > info.range[1])) {
		out.avgScore = 0;
	}

	if (out.avgScore > 1) {
		out.avgScore = 1;
	} else if (out.avgScore < 0) {
		out.avgScore = 0;
	}

	return out;
};

export { evaluateMetric };
