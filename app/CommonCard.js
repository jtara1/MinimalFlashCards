export default class CommonCard {
  /**
   * Takes a string of comma separated numbers like: "0,1,5,2"
   * and returns the array of numbers it represents: [0, 1, 5, 2]
   * @param idsStr
   * @returns {number[]}
   */
  static parseIds = (idsStr) => {
    // alert(`parsing ${idsStr}`);
    let ids = idsStr.split(',');

    // an array of numbers of type Number
    ids = ids.map(id => {
      return Number(id);
    });

    // alert(`parsed ${JSON.stringify(ids)}`);
    return ids;
  };
}