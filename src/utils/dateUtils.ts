export function formateTime(time: number) {
  if (!time) return ''
  let date = new Date(time)
  let year: string | number = date.getFullYear()
  let month: string | number = date.getMonth() + 1
  let day: string | number = date.getDate()
  let hour: string | number = date.getHours()
  let minute: string | number = date.getMinutes()
  let seconds: string | number = date.getSeconds()

  month = month > 9 ? month : '0' + month
  day > 9 ? day : '0' + day
  hour = hour > 9 ? hour : '0' + hour
  minute = minute > 9 ? minute : '0' + minute
  seconds = seconds > 9 ? seconds : '0' + seconds
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
  )
}
export function formateDate(time: number) {
  if (!time) return ''
  let date = new Date(time)
  let year: string | number = date.getFullYear()
  let month: string | number = date.getMonth() + 1
  let day: string | number = date.getDate()

  month = month > 9 ? month : '0' + month
  day > 9 ? day : '0' + day

  return year + '-' + month + '-' + day
}
