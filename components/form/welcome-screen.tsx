"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Users, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
	welcomeScreen: any
	formStyle: { backgroundColor: string; textColor: string; buttonColor: string; buttonTextColor: string; borderRadius: number; fontFamily: string }
	respondentCount: number
	onStart: () => void
}

export function WelcomeScreen({ welcomeScreen, formStyle, respondentCount, onStart }: WelcomeScreenProps) {
	const alignmentClass =
		welcomeScreen.contentAlignment === "left"
			? "items-start text-left"
			: welcomeScreen.contentAlignment === "right"
				? "items-end text-right"
				: "items-center text-center"

	return (
		<div
			className={`min-h-screen flex flex-col font-${formStyle.fontFamily} relative overflow-hidden ${alignmentClass}`}
			style={{ backgroundColor: formStyle.backgroundColor, color: formStyle.textColor }}
		>
			{welcomeScreen.backgroundImage && (
				<div
					className="absolute inset-0 bg-cover bg-center z-0"
					style={{
						backgroundImage: `url(${welcomeScreen.backgroundImage})`,
						opacity: welcomeScreen.backgroundOpacity / 100,
					}}
				/>
			)}

			<div className={`flex-1 flex ${alignmentClass} justify-center p-8 md:p-16 relative z-10`}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className={`max-w-2xl space-y-6 ${welcomeScreen.splitScreen ? "w-full md:w-1/2" : "w-full"}`}
				>
					{welcomeScreen.logo && (
						<motion.img
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							src={welcomeScreen.logo}
							alt="Logo"
							className="h-16 mb-8"
						/>
					)}

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-4xl md:text-6xl font-bold text-balance"
						style={{ color: formStyle.textColor }}
					>
						{welcomeScreen.title}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-lg md:text-xl opacity-80 text-pretty"
						style={{ color: formStyle.textColor }}
					>
						{welcomeScreen.description}
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="flex flex-wrap gap-4 text-sm opacity-70 justify-center"
					>
						{welcomeScreen.showTimeEstimate && welcomeScreen.timeEstimate && (
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>{welcomeScreen.timeEstimate}</span>
							</div>
						)}
						{welcomeScreen.showRespondentCount && (
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4" />
								<span>{respondentCount} responses</span>
							</div>
						)}
					</motion.div>

					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
						<Button
							onClick={onStart}
							size="lg"
							className="text-lg px-8 py-6 h-auto"
							style={{
								backgroundColor: formStyle.buttonColor,
								color: formStyle.buttonTextColor,
								borderRadius: `${formStyle.borderRadius}px`,
							}}
						>
							{welcomeScreen.buttonText}
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}