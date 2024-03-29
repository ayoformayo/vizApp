require "json"
require 'net/http'

zips = [
# manhattan 
10001,
10002,
10003,
10004,
10005,
10006,
10007,
10009,
10010,
10011,
10012,
10013,
10014,
10016,
10017,
10018,
10019,
10020,
10021,
10022,
10023,
10024,
10025,
10026,
10027,
10028,
10029,
10030,
10031,
10032,
10033,
10034,
10035,
10036,
10037,
10038,
10039,
10040,
10044,
10048,
10065,
10069,
10075,
10111,
10115,
10128,
10280,
10281,
10282,

# brooklyn

  11201,
  11203,
  11204,
  11205,
  11206,
  11207,
  11208,
  11209,
  11210,
  11211,
  11212,
  11213,
  11214,
  11215,
  11216,
  11217,
  11218,
  11219,
  11220,
  11221,
  11222,
  11223,
  11224,
  11225,
  11226,
  11228,
  11229,
  11230,
  11231,
  11232,
  11233,
  11234,
  11235,
  11236,
  11237,
  11238,
  11239,
  11251,
# queens
  11001,
  11004,
  11005,
  11040,
  11096,
  11101,
  11102,
  11103,
  11104,
  11105,
  11106,
  11109,
  11354,
  11355,
  11356,
  11357,
  11358,
  11359,
  11360,
  11361,
  11362,
  11363,
  11364,
  11365,
  11366,
  11367,
  11368,
  11369,
  11371,
  11372,
  11373,
  11374,
  11375,
  11377,
  11378,
  11379,
  11385,
  11411,
  11412,
  11413,
  11414,
  11415,
  11416,
  11417,
  11418,
  11419,
  11420,
  11421,
  11422,
  11423,
  11426,
  11427,
  11428,
  11429,
  11430,
  11432,
  11433,
  11434,
  11435,
  11436,
  11451,
  11691,
  11692,
  11694,
  11697,

# bronx
  10451,
  10452,
  10453,
  10454,
  10455,
  10456,
  10457,
  10458,
  10459,
  10460,
  10461,
  10462,
  10465,
  10466,
  10467,
  10468,
  10469,
  10470,
  10471,
  10472,
  10473,
  10474,
  10475,
# staten_island
  10301,
  10302,
  10303,
  10304,
  10305,
  10306,
  10307,
  10308,
  10309,
  10310,
  10312,
  10314,
]

uri = URI("https://data.ny.gov/resource/liquorauthorityactivelicenses.json")
stores = []
zips.each do |zip|
  params = { license_type_name: "ON-PREMISES LIQUOR", zip: zip}
  uri.query = URI.encode_www_form(params)
  parsed = JSON.parse(Net::HTTP.get_response(uri).body)
  stores << parsed
  p parsed
  stores.flatten!
  stores_json = stores.to_json
  File.open('app/views/liquor_licenses/show_1.json', "w") do |f|   
    f.write stores_json
  end

end

file = File.open("app/views/liquor_licenses/show_1.json").read
parsed = JSON.parse file
collection = { "type" => "FeatureCollection",
  "features" => []
}
new_york_topo = File.open("new_york.json").read
parsed_ny = JSON.parse new_york_topo
parsed_ny["stores"] = []
parsed.each do |store|
  if store["location"]
    hash = {
      "type" => "Feature",
      "geometry" => { "type" => "Point", "coordinates" => [ store["location"]["longitude"], store["location"]["latitude"] ] },
      "properties" => { "name" => store["premises_name"] }
    }
    parsed_ny["stores"] << hash
  end
end
ny_json = parsed_ny.to_json
File.open('app/views/maps/new_york.json', "w") do |f|   
  f.write ny_json
end
