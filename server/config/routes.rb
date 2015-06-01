Rails.application.routes.draw do
  get "/liquor_licenses" => "liquor_licenses#show"
  get "/maps/new_york"   => "maps#new_york"
end
