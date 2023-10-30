type Props = {
    message: string,
    date: string,
    status: boolean
}

export default function HistoryBar({ message, date, status }: Props) {
    function formatDate(s: string) {
        return (new Date(s)).toString()
    }

    return (
        <div className={ 'rounded-l-md flex flex-col gap-1 border-l-8 p-2 bg-slate-50' + (status ? ' border-green-500' : ' border-red-500')}>
            <p className='text-sm'> { message } </p>
            <p className="text-xs text-slate-400"> { formatDate(date) } </p>
        </div>
    )
}