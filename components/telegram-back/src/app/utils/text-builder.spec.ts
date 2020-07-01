import { getTimeUnitEnding } from './text-builder'

describe('#getTimeUnitEnding', () => {
  it('should return empty text if timeUnit is greater than 4', () => {
    const result1 = getTimeUnitEnding(5)
    const result2 = getTimeUnitEnding(44)
    const result3 = getTimeUnitEnding(17)

    expect(result1).toEqual('')
    expect(result2).toEqual('')
    expect(result3).toEqual('')
  })

  it('should return a latter "и" if timeUnit is greater than 2 but less than 5', () => {
    const result1 = getTimeUnitEnding(4)
    const result2 = getTimeUnitEnding(3)

    expect(result1).toEqual('и')
    expect(result2).toEqual('и')
  })

  it('should return a latter "у" if timeUnit is equal 1', () => {
    const result1 = getTimeUnitEnding(1)

    expect(result1).toEqual('y')
  })

  it('should return empty text if timeUnit is null or undefined', () => {
    const result1 = getTimeUnitEnding(null)
    const result2 = getTimeUnitEnding(undefined)

    expect(result1).toEqual('')
    expect(result2).toEqual('')
  })

})
