import { Flame, Target, Users } from "lucide-react";

export function FeatureGrid() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Daily Streaks</h3>
          <p className="text-sm text-gray-500">
            Check in every day to keep your streak alive. Miss a day and start
            over — just like Duolingo, but for life goals.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Goal Tracking</h3>
          <p className="text-sm text-gray-500">
            Create goals across health, fitness, learning, mindfulness and
            more. Track your progress with a visual calendar.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Squads</h3>
          <p className="text-sm text-gray-500">
            Invite up to 4 friends to your squad. Share goals, see each
            other&apos;s progress, and stay accountable together.
          </p>
        </div>
      </div>
    </div>
  );
}
