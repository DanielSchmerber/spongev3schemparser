# Simple SpongeV3 Schematic parser
based on prismarine-nbt

-version independe

Example usage
  let schematic = await readSchematicFromBuf(fs.readFileSync("..house.schem"))!

    let block = schematic!.getBlockAt(0,0,0).getSimpleData()

    await new SpongeV3SchematicWriter(schematic!).writeSchematic()