json.array! @courses do |course|
  json.id course.id
  json.name course.name
  json.modules course.mods do |mod|
    json.id mod.id
    json.name mod.name
    json.active mod.active
    json.groups mod.groups do |group|
      json.ta group.ta
      json.students group.students
    end
  end
end
