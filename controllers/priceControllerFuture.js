const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

exports.getPricef = async (req, res) => {
    const { crop, state} = req.body;
    console.log(`helllooooo`);
    if (!crop || !state) {
        return res.status(400).json({ error: 'Crop, state are required.' });
    }

    const Crop = crop.split(' ').join(''); 
    const State = state.split(' ').join('');
    console.log(`Searching for crop: ${Crop}, state: ${State}.`);

    try {
        let foundPrice;
        const datapath = path.join(__dirname, '../data', 'output_prediction.csv');

        const readCSV = () => {
            console.log(`hello`);
            return new Promise((resolve, reject) => {
                fs.createReadStream(datapath)
                    .pipe(csvParser())
                    .on('data', (row) => {
                        if (row['state'] === State && row[Crop] !== undefined) {
                            foundPrice = row[Crop];
                            foundPrice = Math.round(foundPrice * 100) / 100;
                            console.log(`Found price: ${foundPrice} for ${State}`);
                        }
                    })
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        };

        await readCSV();

        if (foundPrice !== undefined) {
            res.json({
                crop: Crop,
                state: State,
                price: foundPrice
            });
        } else {
            res.status(404).json({ error: `No data found for ${State}`});
        }

    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Error processing request' });
    }
};
