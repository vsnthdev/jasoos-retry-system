/*
 *  Entrypoint for this project.
 *  Created On 10 July 2024
 */

import { getInputRecords, getOutputRecords } from "./read";
import { createPromiseSequencer } from '@triyanox/async-sequence'
import { single } from "./single";

const records = await getInputRecords()
const output = await getOutputRecords()

const promises = await createPromiseSequencer(
    records.map(record => () => single(record, output)),
    {
        concurrency: 1,
        disableLogs: true,
    }
)

await promises.start()
