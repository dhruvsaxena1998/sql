import SQL, { SQLStatement } from '../index'

describe('SQLStatement', () => {
  it('should not be allowed to be called as a function', () => {
    expect(() => SQLStatement`SELECT * FROM users WHERE id = ${1}`).toThrow(TypeError)
  })
})

describe('SQL', () => {
  it('should work with a simple query', () => {
    const q = SQL`SELECT 1 + 1 as result`

    expect(q.sql).toBe('SELECT 1 + 1 as result')
    expect(q.values).toEqual([])
  })

  it('should work with a query with values', () => {
    const q = SQL`SELECT * FROM users WHERE id = ${1} WHERE name = ${'John'}`

    expect(q.sql).toBe('SELECT * FROM users WHERE id = ? WHERE name = ?')
    expect(q.values).toEqual([1, 'John'])
  })

  it('should work with falsy values', () => {
    const q = SQL`SELECT * FROM users WHERE id = ${0} WHERE name = ${''} AND active = ${false}`

    expect(q.sql).toBe('SELECT * FROM users WHERE id = ? WHERE name = ? AND active = ?')
    expect(q.values).toEqual([0, '', false])
  })

  describe('append()', () => {
    it('should append to the query', () => {
      const q = SQL`SELECT * FROM users WHERE id = ${1}`
      q.append(SQL`AND name = ${'John'}`)

      expect(q.sql).toBe('SELECT * FROM users WHERE id = ? AND name = ?')
      expect(q.values).toEqual([1, 'John'])
    })

    it('should append a raw string', () => {
      const q = SQL`SELECT * FROM users WHERE id = ${1}`
      q.append('AND name = "John"')

      expect(q.sql).toBe('SELECT * FROM users WHERE id = ? AND name = "John"')
      expect(q.values).toEqual([1])
    })

    it('should append multiple append statements', () => {
      const q = SQL`SELECT * FROM users WHERE id = ${1}`
        .append(SQL`AND name = ${'John'}`)
        .append(SQL`AND age = ${250}`)
        .append(SQL`AND fname = ${'Doe'}`)

      expect(q.sql).toBe('SELECT * FROM users WHERE id = ? AND name = ? AND age = ? AND fname = ?')
      expect(q.values).toEqual([1, 'John', 250, 'Doe'])
    })

    it('should work with multiline complex queries and sub-queries', () => {
      const id = 123
      const q = SQL`
        SELECT
          u.id,
          u.name,
          u.email,
          SUM(u.amount) as total,
          (SELECT fid FROM financial WHERE userid = ${id}) as finacial_id
        FROM users AS u
        INNER JOIN roles AS r ON u.roleid = r.id
        WHERE u.id = ${id}
      `
      q.append(SQL`AND age = ${250} AND fname = ${'Doe'}`).append(SQL`GROUP BY u.id, u.name, u.email, u.amount`)

      expect(q.sql).toBe(
        `SELECT u.id, u.name, u.email, SUM(u.amount) as total, (SELECT fid FROM financial WHERE userid = ?) as finacial_id FROM users AS u INNER JOIN roles AS r ON u.roleid = r.id WHERE u.id = ? AND age = ? AND fname = ? GROUP BY u.id, u.name, u.email, u.amount`
      )

      expect(q.values).toEqual([id, id, 250, 'Doe'])
    })
  })
})
