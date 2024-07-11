/*
 *  Processes a single scraping job.
 *  Created On 10 July 2024
 */

import { getKeyValue, getLinkedInValue, writeRecord } from "./read"

export async function single(record: any, output: any[]) {
    const linkedin = getLinkedInValue(record)
    const key = getKeyValue(record)

    // skip if already exists
    const exists = output.find(rec => getKeyValue(rec) == key)
    if (exists) {
        return console.log(`Already exists, skipping: ${key}`)
    }

    const req = await fetch(`https://jasoos.vsnth.dev/linkedin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            linkedin
        })
    })

    if (req.status != 200) throw Error('Failed fetching')

    const { blob } = await req.json()

    await writeRecord({ ...record, scraped: blob })
    console.log(`Scraped: ${key}`)
}
