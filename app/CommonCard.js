export default class CommonCard {
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