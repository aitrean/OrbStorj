// allow waiting for multiple events

/**
 * [waitForMultipleEvents takes an array of events and then fires given function]
 * [{event: event,
 *   type: type}, {}]
 * @param  {Array} events [array of events to promisify]
 * @return {Function}
 */
const waitForMultipleEvents = async function waitForMultipleEvents(events, cb) {
	let arr = [];
	for (let e of events) {
		arr.push(
			new Promise((resolve) => {
				e.event.on(e.type, (...res) => {
          (res.length > 1 ? resolve(res) : resolve(res[0]));
        });
			}));
	}
	let result = await Promise.all(arr);
  cb(result);
  waitForMultipleEvents(events,cb);
};

const exportObj = {
	prmify: waitForMultipleEvents,
};

module.exports = exportObj;
