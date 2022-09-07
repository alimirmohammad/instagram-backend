export function processHashtags(caption) {
  return (caption.match(/#[\w]+/g) ?? []).map(hashtag => ({
    where: { hashtag },
    create: { hashtag },
  }));
}
