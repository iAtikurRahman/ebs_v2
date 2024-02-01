// base64 to text converter funtion here
async function decodeReactionList(results) {
    try {
      const decodedResults = await Promise.all(results.map(async (result) => {
        if (result.reaction_icon) {
          try {
            const decodedData = new TextDecoder('utf-8').decode(
              new Uint8Array([...Buffer.from(result.reaction_icon, 'base64')])
            );
            return { ...result, reaction_icon: decodedData };
          } catch (decodeError) {
            return result;
          }
        }
        return result;
      }));
      return decodedResults;
    } catch (error) {
      return results;
    }
  }

module.exports = {decodeReactionList};