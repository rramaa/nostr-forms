import React from 'react'
import {Button, Row} from "antd";

interface Response {
    answerType: number
    inputValue: string
    otherMessage: string
    question: string
    tag: string
}

interface UserInfo {
    [pubkey: string]: {
        display_name: string
    }
}

export const Export: React.FC<{responses: {plaintext: string, pubkey: string}[], userInfo: UserInfo, formName: string}> = (props) => {
    const onDownloadClick = async (type: 'csv' | 'excel') => {
        const XLSX = await import('xlsx')
        const SheetName = `Responses for ${props.formName}`
        const responses = props.responses.map(({plaintext}) => JSON.parse(plaintext)) as Response[][]
        const parsedResponse = responses
            .map((response, index) => {
                const resp = {
                    User: props.userInfo[props.responses[index].pubkey]?.display_name ?? 'Anonymous Response'
                }
                response
                    .reduce<Record<string, string>>((newResponse, answer) => {
                        newResponse[answer.question] = answer.inputValue
                        return newResponse
                    }, resp)
                return resp
            })
        const workSheet = XLSX.utils.json_to_sheet(parsedResponse)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, `${SheetName}`)
        if(type === 'excel') {
            XLSX.writeFile(workBook, `${SheetName}.xlsx`)
        } else {
            XLSX.writeFile(workBook, `${SheetName}.csv`)
        }
    }
    return (
        <Row>
            <Button onClick={() =>onDownloadClick('excel')}>Export as Excel</Button>
            <Button onClick={() =>onDownloadClick('csv')}>Export as CSV</Button>
        </Row>
    )
}