import _ from 'lodash'
import users from './users.json'

/**
 * Asynchronously fetch an array of users that match the given search query.
 *
 * @type {String} searchQuery
 *   The current search query.
 * @return {Promise.<Object[]>}
 *   List of users that were found in the form: { id: String, username: String }
 */

export default function searchUsers(searchQuery) {
  return new Promise((resolve, reject) => {
    // In order to make this seem like an API call, add a set timeout for some
    // async. We'll add about 300 ms which is in the ballpark of how much latency
    // you might see in production.
    setTimeout(() => {
      // WARNING: In a production environment you should escape the search query.
      const regex = RegExp(`^${searchQuery}`, 'gi')

      // If you want to get fancy here, you can add some emphasis to the part
      // of the string that matches.
      const result = _.filter(users, user => {
        return user.username.match(regex)
      })

      // Only return the first 5 results
      resolve(result.slice(0, 5))
    }, 300)
  })
}
