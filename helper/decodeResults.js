// base64 to text converter funtion here
async function decodeResults(results) {
    try {
      const decodedResults = await Promise.all(results.map(async (result) => {
        if (result.caption) {
          try {
            const decodedData = new TextDecoder('utf-8').decode(
              new Uint8Array([...Buffer.from(result.caption, 'base64')])
            );
            return { ...result, caption: decodedData };
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

module.exports = {decodeResults};