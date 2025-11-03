                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic profile information that appears on all CVs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVProfileForm profile={profile} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
              <Button onClick={() => setActiveTab('experience')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>