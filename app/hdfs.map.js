/**
* Mapper chunk processing function.
* Reads STDIN
*/
function execute() {
    var chunk = process.stdin.read(); // Read a chunk
    if (chunk !== null) {
        // Replace all newlines and tab chars with spaces
        ['"', ':', '{', '}'].forEach(function (char) {
            chunk = chunk.replace(new RegExp(char, 'g'), ' ');
        });

        // Split it
        var words = chunk.trim().split(' ');
        var counts = {};

        // Count words
        words.forEach(function (word) {
            word = word.trim();

            if (word.length) {
                if (!counts[word]) {
                    counts[word] = 0;
                }

                counts[word]++;
            }
        });

        // Emit results
        Object.keys(counts).forEach(function (word) {
            var count = counts[word];
            process.stdout.write(word + '\t' + count + '\n');
        });
    }
}

process.stdin.setEncoding('utf8');
process.stdin.on('readable', execute); // Set STDIN processing handler