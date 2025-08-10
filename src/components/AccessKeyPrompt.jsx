import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const AccessKeyPrompt = ({ onSubmit }) => {
  const [accessKey, setAccessKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      toast.error("Veuillez saisir une clé d'accès");
      return;
    }

    setIsValidating(true);
    
    // Simulate validation delay
    setTimeout(() => {
      const isValid = onSubmit(accessKey.trim());
      
      if (isValid) {
        toast.success("Accès autorisé ! Bienvenue dans FIFA Predictor");
      } else {
        toast.error("Clé d'accès invalide. Veuillez réessayer.");
        setAccessKey("");
      }
      
      setIsValidating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Lock" size={32} className="text-black" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Accès Sécurisé
            </h1>
            <p className="text-gray-400 text-sm">
              Saisissez votre clé d'accès pour accéder à FIFA Predictor
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <Input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Saisissez votre clé d'accès..."
                className="w-full text-center text-lg tracking-wider"
                disabled={isValidating}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isValidating || !accessKey.trim()}
              className="w-full relative"
            >
              {isValidating ? (
                <div className="flex items-center justify-center">
                  <ApperIcon name="Loader2" size={20} className="animate-spin mr-2" />
                  Vérification...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ApperIcon name="Unlock" size={20} className="mr-2" />
                  Accéder à l'application
                </div>
              )}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-xs text-gray-500"
          >
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="Shield" size={12} />
              <span>Système sécurisé FIFA Predictor</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessKeyPrompt;