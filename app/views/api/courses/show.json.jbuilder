json.extract! @course, :id, :name
json.modules @course.mods do |mod|
  json.id mod.id
  json.name mod.name
  json.active mod.active
  json.groups mod.groups do |group|
    json.id group.id
    json.ta group.ta
    json.students group.students
  end
end
