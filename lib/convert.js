var spawn = require('child_process').spawn
var Promise = require('promise');

module.exports = {
	toPng: function(svg) {
		return new Promise(function(fulfil, reject) {
			convert	= spawn('convert', ['svg:-', 'png:-']);

			// Write the output of convert straight to the response
			convert.stdout.on('data', function(data) {
				try {
					var prevBufferLength = (buffer ? buffer.length : 0),
						newBuffer = new Buffer(prevBufferLength + data.length);

					if (buffer) {
						buffer.copy(newBuffer, 0, 0);
					}

					data.copy(newBuffer, prevBufferLength, 0);

					buffer = newBuffer;
				} catch (err) {
					reject(err, null);
				}
			});

			// When we're done, we're done
			convert.on('exit', function(code) {
				fulfil(buffer);
			});

			convert.stdin.end(svg);
		});
	}
};