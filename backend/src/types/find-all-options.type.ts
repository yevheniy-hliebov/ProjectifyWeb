/**
 * Options for the findAll function.
 * 
 * @property {number} skip - The number of records to skip.
 * @property {number} limit - The maximum number of records to return.
 * @property {string} sort - For sorting the results.
 * @property {Object} search - The search criteria.
 *   @property {string} searchText - The text to search for.
 *   @property {Array<string>} fields - The fields to search within.
 * @property {Object} filter - Additional filtering criteria.
 * @property {string | string[] | Record<string, number | boolean | object>} select - Specifies which document fields to include [1] or exclude [0]
 */
export type FindAllOptions = {
  skip?: number,
  limit?: number,
  sort?: string,
  search?: {
    searchText: string,
    fields?: Array<string>
  },
  filter?: object,
  select?: string | string[] | Record<string, number | boolean | object>
}
