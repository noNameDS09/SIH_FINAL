const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

exports.compareController = async (req, res) => {
    const { crop, state, monthYear } = req.body;

    if (!crop || !state) {
        return res.status(400).json({ error: 'Crop, state, and monthYear are required.' });
    }

    const cleanCrop = crop.split(' ').join('');
    const cleanState = state.split(' ').join('');
    const cleanMonthYear = monthYear;

    try {
        const prices = [];
        let foundPrice;
        const datapath = path.join(__dirname, '../data', 'Gur.csv'); // Adjust according to your setup
        const csvStream = fs.createReadStream(datapath).pipe(csvParser());

        csvStream.on('data', (row) => {
            if (row['state'] === cleanState && row['crop'] === cleanCrop) {
                const monthYearKeys = Object.keys(row).filter(key => key.includes('-'));
                const index = monthYearKeys.indexOf(cleanMonthYear);
                // console.log(index);
                // console.log(monthYearKeys);
                // console.log(monthYearKeys.indexOf('Apr-16'));
                // Collect prices for the last three months
                if (index !== -1) {
                    for (let i = 1; i < 13; i++) {
                        if (monthYearKeys[index - i]) {
                            prices.push({
                                monthYear: monthYearKeys[index - i],
                                price: row[monthYearKeys[index - i]] || 'hello' // Handle missing data
                            });
                        }
                    }
                    console.log(prices);
                }
            }

            // Check for the specific price
            if (row['state'] === cleanState && row['crop'] === cleanCrop) {
                foundPrice = row[cleanMonthYear];
                console.log(`Found price: ${foundPrice} for ${cleanState} in ${cleanMonthYear} ${cleanCrop}`);
            }
        });
        console.log(prices);

        csvStream.on('end', () => {
            if (prices.length > 0) {
                res.json({
                    prices: prices.reverse(), // Return in chronological order
                    // specificPrice: foundPrice !== undefined ? {
                    //     crop: crop,
                    //     state: state,
                    //     monthYear: monthYear,
                    //     price: foundPrice
                    // } : null
                });
            } else {
                res.status(404).json({ error: `No data found for ${cleanState} in the last three months for ${cleanCrop}` });
            }
        });

        csvStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Error reading data file' });
        });

    } catch (err) {
        console.error('Error opening CSV file:', err);
        res.status(500).json({ error: 'Error accessing data file' });
    }
};

