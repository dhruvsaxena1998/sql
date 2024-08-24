export class SQLStatement {
  strings: string[]
  values: any[]

  constructor(strings: string[], values: any[]) {
    this.strings = strings
    this.values = values
  }
  
  get sql() {
    return this.strings.join('?').replace(/\s+/g, ' ').trim()
  }

  append(statement: string | SQLStatement) {
    if (statement instanceof SQLStatement) {
      this.strings[this.strings.length - 1] += ' ' + statement.sql
      this.values.push.apply(this.values, statement.values)
    } else {
      this.strings[this.strings.length - 1] += ' ' + statement
    }

    return this
  }

}

export const SQL = (strings: TemplateStringsArray, ...values: any[]): SQLStatement => {
  return new SQLStatement(strings.slice(0), values)
}

export default SQL
