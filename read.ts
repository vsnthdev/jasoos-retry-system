/*
 *  Reads the given input file & contains mappings
 *  of where fields.
 *  Created On 10 July 2024
 */

import { json2csv } from "json-2-csv"
import neatCsv from "neat-csv"

export function getKeyValue(record: any) {
    return record['Whatsapp Number*'].trim().toLowerCase()
}

export function getLinkedInValue(record: any) {
    return record['Linkedin/ social media*'].trim().toLowerCase()
}

export async function getOutputRecords() {
    const outputStr = await Bun.file('./output.csv').text()
    return await neatCsv(outputStr) as any[]
}

export async function getInputRecords() {
    const inputStr = await Bun.file('./input.csv').text()
    const input = await neatCsv(inputStr) as any[]

    const output = await getOutputRecords()

    return input.filter(rec => {
        const exists = output.find(r => getKeyValue(r) == getKeyValue(rec))

        if (!exists) return true
    })
}

export async function writeRecord(record: any) {
    const output = await getOutputRecords()

    output.push(record)

    const csv = await json2csv(output)
    await Bun.write('output.csv', csv)
}
