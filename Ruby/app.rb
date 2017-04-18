require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/json'
require 'sinatra/cross_origin'
require './task_service.rb'
require 'json'

class App < Sinatra::Base
    register Sinatra::Reloader
    register Sinatra::CrossOrigin

    configure do
        enable :cross_origin
    end
    
    def initialize
        @task_service = TaskService.new()
        super()
    end

    get '/' do
        'Hello'
    end

    get '/tasks' do
        tasks = @task_service.get_tasks()
        json tasks
    end

    get '/task/:key' do |key|
        task = @task_service.get_task(key)
        json task
    end

    post '/create' do
        task = JSON.parse(request.body.read)
        @task_service.create_task(task)
        message = { 'status' => 'OK'}
        json message
    end

    post '/edit/:key' do |key|
        task = JSON.parse(request.body.read)
        @task_service.update_task(key, task)
        message = { 'status' => 'OK'}
        json message
    end

    post '/complete/:key' do |key|
        @task_service.complete_task(key)
        message = { 'status' => 'OK'}
        json message
    end

    post '/delete/:key' do |key|
        @task_service.delete_task(key)
        message = { 'status' => 'OK'}
        json message
    end

    #angular hack
    options '/create' do
        'OK'
    end

    options '/edit/:key' do
        'OK'
    end

    options '/delete/:key' do
        'OK'
    end

    options '/complete/:key' do
        'OK'
    end
end