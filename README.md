# High Fidelity
High Fidelity is meant to be a richer media library for music. The primary
focus is for classical music but it can be used for any type of music.

The basic design is something called a MediaItem that has a name, type and
a id, called a slugs. A MediaItem is also tied to a user so different users
can have the same slug, without risk of collision.

A MediaItem also has Map of tags and that is where the magic happens. That's
where you express the relationship between different MediaItems. For instance,
if you have a MediaItem called `baroque-era` of type `era` the composer
`johann-sebastian-bach` might have a `era` tag with `baroque-era`.

A MediaItem also has a Map of uris where each uri has type, like `spotifyUri` and
`wikipedia`.

The MediaItems is stupid. On top of that it is a layer that interpret MediaItems
and translate them into more domain specific models like Genre, Composer and Artist.

It uses firebase to store the MediaItems for each user. 
